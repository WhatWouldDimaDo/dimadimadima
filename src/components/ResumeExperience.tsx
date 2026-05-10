import { useState } from 'react';
import ClientLogoWall from './ClientLogoWall';
import WorkTimeline from './WorkTimeline';

export default function ResumeExperience() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <ClientLogoWall onFilter={setActiveFilter} activeFilter={activeFilter} />
      </div>
      <WorkTimeline filterCompany={activeFilter} />
    </div>
  );
}
