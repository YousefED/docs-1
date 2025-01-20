import magic
from django.db import migrations
from django.core.files.storage import default_storage

def fix_attachments_content_type(apps, schema_editor):
    """
    Iterate over all Document objects and fix ContentType for files in
    <doc_id>/attachments/ prefix on default_storage (MinIO).
    """

    Document = apps.get_model('core', 'Document')

    s3_client = default_storage.connection.meta.client
    bucket_name = default_storage.bucket_name

    mime_detector = magic.Magic(mime=True)

    documents = Document.objects.all()
    print(f"[INFO] Found {documents.count()} documents. Starting ContentType fix...")

    for doc in documents:
        doc_id_str = str(doc.id)
        prefix = f"{doc_id_str}/attachments/"
        print(f"[INFO] Processing attachments under prefix '{prefix}' ...")

        continuation_token = None
        total_updated = 0

        while True:
            list_kwargs = {
                "Bucket": bucket_name,
                "Prefix": prefix
            }
            if continuation_token:
                list_kwargs["ContinuationToken"] = continuation_token

            response = s3_client.list_objects_v2(**list_kwargs)

            # If no objects found under this prefix, break out of the loop
            if "Contents" not in response:
                break

            for obj in response["Contents"]:
                key = obj["Key"]

                # Skip if it's a folder
                if key.endswith("/"):
                    continue

                try:
                    # Get existing metadata
                    head_resp = s3_client.head_object(Bucket=bucket_name, Key=key)
                    old_metadata = head_resp.get("Metadata", {})

                    # Read first ~1KB for MIME detection
                    partial_obj = s3_client.get_object(
                        Bucket=bucket_name,
                        Key=key,
                        Range="bytes=0-1023"
                    )
                    partial_data = partial_obj["Body"].read()

                    # Detect MIME type
                    magic_mime_type = mime_detector.from_buffer(partial_data)

                    # Update ContentType
                    s3_client.copy_object(
                        Bucket=bucket_name,
                        CopySource={"Bucket": bucket_name, "Key": key},
                        Key=key,
                        ContentType=magic_mime_type,
                        Metadata=old_metadata,
                        MetadataDirective="REPLACE"
                    )
                    total_updated += 1

                except Exception as exc:
                    print(f"[ERROR] Could not update ContentType for {key}: {exc}")

            if response.get("IsTruncated"):
                continuation_token = response.get("NextContinuationToken")
            else:
                break

        if(total_updated > 0):
          print(f"[INFO] -> Updated {total_updated} objects for Document {doc_id_str}.")


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_make_document_creator_and_invitation_issuer_optional'),
    ]

    operations = [
        migrations.RunPython(
            fix_attachments_content_type,
            reverse_code=migrations.RunPython.noop
        ),
    ]
