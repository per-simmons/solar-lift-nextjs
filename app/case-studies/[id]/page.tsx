import ClientComponent from './page-client';

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  return <ClientComponent params={params} />;
} 