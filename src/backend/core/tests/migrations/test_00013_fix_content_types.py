import uuid
import pytest
from core import factories
from django.core.files.storage import default_storage

@pytest.mark.django_db
def test_fix_attachments_content_type_migration(migrator):
    """
    Test that the migration fixes the ContentType of attachment in our storage.
    """
    migrator.apply_initial_migration(('core', '0012_make_document_creator_and_invitation_issuer_optional'))

    doc_id = uuid.uuid4()
    factories.DocumentFactory(id=doc_id)

    # Put a file with a *wrong* ContentType
    s3_client = default_storage.connection.meta.client
    bucket_name = default_storage.bucket_name
    key = f"{doc_id}/attachments/testfile.png"
    fake_png = (
      b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR..."
    )
    s3_client.put_object(
        Bucket=bucket_name,
        Key=key,
        Body=fake_png,
        ContentType="text/plain",
        Metadata={"owner": "None"}
    )

    # Apply the migration that fixes the ContentType
    migrator.apply_tested_migration(('core', '00013_fix_content_types'))

    head_resp = s3_client.head_object(Bucket=bucket_name, Key=key)
    assert head_resp["ContentType"] == "image/png", (
        f"ContentType not fixed, got {head_resp['ContentType']!r}"
    )

    # Check that original metadata was preserved
    assert head_resp["Metadata"].get("owner") == "None"
