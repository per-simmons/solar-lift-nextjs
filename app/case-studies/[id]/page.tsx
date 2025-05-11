import ServerComponent from './page-server';

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  return <ServerComponent params={params} />;
} 