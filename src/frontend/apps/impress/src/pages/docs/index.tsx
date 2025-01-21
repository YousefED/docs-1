import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactElement } from 'react';

import { useAuthStore } from '@/core';
import { DocDefaultFilter } from '@/features/docs';
import { DocsGrid } from '@/features/docs/docs-grid';
import { MainLayout } from '@/layouts';
import { NextPageWithLayout } from '@/types/next';

const Page: NextPageWithLayout = () => {
  const searchParams = useSearchParams();
  const target = searchParams.get('target');
  const router = useRouter();
  const auth = useAuthStore();
  const url = auth.getAuthUrl();
  console.log('url', url);
  if (auth.authenticated && url) {
    router.replace(url);
    return null;
  }

  return <DocsGrid target={target as DocDefaultFilter} />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout backgroundColor="grey">{page}</MainLayout>;
};

export default Page;
