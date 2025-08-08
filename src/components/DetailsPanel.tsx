import React from 'react';
import DetailList from './DetailList';
import { PersonNodeData } from "./PersonNodeComponent";
import { LineageData } from "../domain/LineageData";
import { useDetailsPanelData } from './hooks/useDetailsPanelData';
import { getDetailsPanelStyles } from './styles/detailsPanelStyles';
import { useTheme } from '../context/ThemeContext';
import PersonalEventsSection from './PersonalEventsSection';
import LifeEventsSection from './LifeEventsSection';
import PeopleSection from './PeopleSection';

interface DetailsPanelProps {
  nodeData: PersonNodeData | null;
  onNodeSelect?: (node: LineageData) => void;
  isMobile?: boolean;
  personTitle?: string;
}

const EmptyState: React.FC<{ isMobile: boolean; styles: any }> = ({isMobile, styles}) => (
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
  const {theme} = useTheme();
  const {
    detailItems,
    children,
    parentsData,
    partnersData,
    lifeEvents,
    personalEvents
  } = useDetailsPanelData(nodeData);
  const styles = getDetailsPanelStyles(isMobile, theme);

  if (!nodeData) {
    return <EmptyState isMobile={isMobile} styles={styles}/>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        {personTitle || nodeData.name}
      </div>

      <DetailList
        items={detailItems}
      />

      <PeopleSection
        titleSingle="Partner"
        titlePlural="Partners"
        peopleData={partnersData}
        onNodeSelect={onNodeSelect}
        isMobile={isMobile}
        sectionSpacing={styles.sectionSpacing}
      />

      <PeopleSection
        titleSingle="Parent"
        titlePlural="Parents"
        peopleData={parentsData}
        onNodeSelect={onNodeSelect}
        isMobile={isMobile}
        sectionSpacing={styles.sectionSpacing}
      />

      <PeopleSection
        titleSingle="Child"
        titlePlural="Children"
        peopleData={children}
        onNodeSelect={onNodeSelect}
        isMobile={isMobile}
        sectionSpacing={styles.sectionSpacing}
      />

      <PersonalEventsSection
        personalEvents={personalEvents}
        isMobile={isMobile}
        sectionSpacing={styles.sectionSpacing}
        onNodeSelect={onNodeSelect}
      />

      <LifeEventsSection
        lifeEvents={lifeEvents}
        isMobile={isMobile}
        sectionSpacing={styles.sectionSpacing}
        onNodeSelect={onNodeSelect}
      />
    </div>
  );
};

export default DetailsPanel;
