
import { useContext, useState, useEffect, FC } from 'react';
import { ProductsContext } from '../../../context/ProductContext';
import { RecommendationsService } from '../../../api/Recommendations';
import { showToast } from '../../../const/toastConfig';
import { RecommendationSelector } from './RecommendationSelector';
import { Button } from '../../../ui/Button/Button';

export interface RecommendationsType {
    closeModal: () => void;
    handleLoading: () => void;
  }

 export interface SelectedGroupsType {
    categoryId: string;
    groupIds: string[];
  }

  export const Recommendations: FC<RecommendationsType> = ({ closeModal, handleLoading }) => {
    const { state } = useContext(ProductsContext);
    const { categories, groupProducts } = state;
    const [selectedGroups, setSelectedGroups] = useState<{ [key: string]: string[] }>({});
   

    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          handleLoading()
          const response = await RecommendationsService.fetchRecommendations();
          setSelectedGroups(response);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        } finally {
          handleLoading()
        }
      };
  
      fetchRecommendations();
    }, []);
  
    const handleSelectedGroups = (categoryId: string, groupId: string) => {
      setSelectedGroups((prevSelectedGroups) => {
        const groupIds = prevSelectedGroups[categoryId] || [];
        const updatedGroupIds = groupIds.includes(groupId)
          ? groupIds.filter((id) => id !== groupId)
          : [...groupIds, groupId];
        return { ...prevSelectedGroups, [categoryId]: updatedGroupIds };
      });
    };
  
    const handleSelectAllGroups = (categoryId: string) => {
      setSelectedGroups((prevSelectedGroups) => {
        const categoryGroups = groupProducts.filter((group) => group.categoryId === categoryId).map((group) => group.id);
        const isAllSelected = (prevSelectedGroups[categoryId] || []).length === categoryGroups.length;
        const updatedGroupIds = isAllSelected ? [] : categoryGroups;
        return { ...prevSelectedGroups, [categoryId]: updatedGroupIds };
      });
    };
  
    const handleSaveRecommendations = async () => {
      try {
        handleLoading()
        await RecommendationsService.saveRecommendations(selectedGroups);
        showToast('success', 'Recommendations saved successfully');
        closeModal();
      } catch (error) {
        console.error('Error saving recommendations:', error);
        showToast('error', 'Recommendations save failed');
      } finally {
        handleLoading()
      }
    };
  
    return (
      <div className="recommendations-selector">
        {categories.length > 0 &&
          categories.map((category) => (
            <RecommendationSelector
              key={category.id}
              category={category}
              groups={groupProducts.filter((group) => group.categoryId === category.id)}
              selectedGroups={selectedGroups[category.id] || []}
              handleSelectedGroups={handleSelectedGroups}
              handleSelectAllGroups={handleSelectAllGroups}
            />
          ))}
        <div className="save-button-block">
          <Button size="large" background="base" color="basic" onClick={handleSaveRecommendations}>
            Сохранить выбранные категории
          </Button>
        </div>
      </div>
    );
  };