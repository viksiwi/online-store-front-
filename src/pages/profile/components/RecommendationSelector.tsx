import { FC, useState } from "react";
import { CategoryType, GroupProductType } from "../../../types/ProductTypes";
import { AnimatePresence } from "framer-motion";
import { motion } from 'framer-motion';
import { Checkbox } from "../../../ui/Checkbox/Checkbox";

interface RecommendationSelectorType {
    category: CategoryType;
    groups: GroupProductType[];
    selectedGroups: string[];
    handleSelectedGroups: (categoryId: string, groupId: string) => void;
    handleSelectAllGroups: (categoryId: string) => void;
  }
  
  const animationStyles = {
    open: { opacity: 1, height: "auto" },
    close: { opacity: 0, height: 0 },
  };
  
  const transition = {
    type: 'tween',
    ease: [0.45, 0, 0.55, 1],
    duration: 0.25,
  };
  
  export const RecommendationSelector: FC<RecommendationSelectorType> = ({
    category,
    groups,
    selectedGroups,
    handleSelectedGroups,
    handleSelectAllGroups,
  }) => {
    const [isGroupsOpened, setIsGroupsOpened] = useState<boolean>(false);
  
    const selectedCategory = selectedGroups.length === groups.length;
    const hasSelectedGroup = (groupId: string): boolean => selectedGroups.includes(groupId);
  
    const handleGroupsOpened = () => {
      if (!groups.length) return;
      setIsGroupsOpened((prev) => !prev);
    };
  
    const effect = {
      initial: isGroupsOpened ? 'close' : 'open',
      animate: 'open',
      exit: 'close',
      variants: animationStyles,
      transition: transition,
    };
  
    return (
      <div className='recommendation-selector'>
        <div className='recommendation-selector-title' onClick={handleGroupsOpened}>
          <span style={{ fontSize: '25px' }}>{category.name}</span>
        </div>
        <AnimatePresence initial={false}>
          {isGroupsOpened && (
            <motion.div {...effect} className='recommendation-groups'>
              <div>
                {groups.length > 0 && (
                  <div className="choose-all">
                    <Checkbox
                      size="small"
                      color="base"
                      checked={selectedCategory}
                      onChange={() => handleSelectAllGroups(category.id)}
                    />
                    <span>Выбрать все группы</span>
                  </div>
                )}
                <div className='groups-container'>
                  {groups.map((group) => (
                    <div key={group.id} className='checkbox-container'>
                      <Checkbox
                        size="small"
                        color="base"
                        checked={hasSelectedGroup(group.id)}
                        onChange={() => handleSelectedGroups(category.id, group.id)}
                      />
                      <span>{group.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };