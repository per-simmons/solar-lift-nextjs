'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const ClientComponent = dynamic(
  () => import('./page-client'),
  { ssr: false }
);

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  return <ClientComponent params={params} />;
} 