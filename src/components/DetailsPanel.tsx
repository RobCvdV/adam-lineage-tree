import React from 'react';
import DetailList from './DetailList';
import { PersonNodeData } from "./PersonNodeComponent";
import { LineageData } from "../domain/LineageData";
import { useDetailsPanelData } from './hooks/useDetailsPanelData';
import { getDetailsPanelStyles } from './styles/detailsPanelStyles';
import PersonalEventsSection from './PersonalEventsSection';
import LifeEventsSection from './LifeEventsSection';
import ParentSection from './ParentSection';
import ChildrenSection from './ChildrenSection';

interface DetailsPanelProps {
  nodeData: PersonNodeData | null;
  onNodeSelect?: (node: LineageData) => void;
  isMobile?: boolean;
  personTitle?: string;
}

const EmptyState: React.FC<{ isMobile: boolean; styles: any }> = ({ isMobile, styles }) => (
  <div style={styles.emptyState}>
    {isMobile ? 'Tap a person in the tree to see their details.' : 'Select a person to see details.'}
  </div>
);

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  nodeData, 
  onNodeSelect, 
  isMobile = false, 
  personTitle
}) => {
  const { detailItems, children, parentData, lifeEvents, personalEvents } = useDetailsPanelData(nodeData);
  const styles = getDetailsPanelStyles(isMobile);

  if (!nodeData) {
    return <EmptyState isMobile={isMobile} styles={styles} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        {personTitle || nodeData.name}
      </div>

      <DetailList items={detailItems}/>

      <PersonalEventsSection 
        personalEvents={personalEvents} 
        isMobile={isMobile} 
        sectionSpacing={styles.sectionSpacing} 
      />

      <LifeEventsSection 
        lifeEvents={lifeEvents} 
        isMobile={isMobile} 
        sectionSpacing={styles.sectionSpacing} 
      />

      <ParentSection 
        parentData={parentData} 
        onNodeSelect={onNodeSelect} 
        isMobile={isMobile} 
        sectionSpacing={styles.sectionSpacing} 
      />

      <ChildrenSection
        childrenData={children} 
        onNodeSelect={onNodeSelect} 
        isMobile={isMobile} 
        sectionSpacing={styles.sectionSpacing} 
      />
    </div>
  );
};

export default DetailsPanel;
