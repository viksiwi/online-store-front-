import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUrlParams } from '../../context/UrlParamContext';

type Filters = {
    priceFrom: string;
    priceTo: string;
    recommended: boolean;
    popular: boolean;
    rate: string;
  };

export const FilterPanel: React.FC = () => {
    const { params, updateParam, resetParams } = useUrlParams();
    const [errors, setErrors] = useState<{ priceFrom?: string; priceTo?: string }>({});
    const [filters, setFilters] = useState({
      priceFrom: params.get('priceFrom') || '',
      priceTo: params.get('priceTo') || '',
      recommended: params.get('recommended') === 'true',
      popular: params.get('popular') === 'true',
      rate: params.get('rate') || '',
    });
  
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: type === 'checkbox' ? checked : value,
        }));
      };

      const validateFilters = () => {
        const newErrors: { priceFrom?: string; priceTo?: string } = {};
      
        if (filters.priceFrom && !filters.priceTo) {
          newErrors.priceTo = 'Заполните это поле';
        }
        if (filters.priceTo && !filters.priceFrom) {
          newErrors.priceFrom = 'Заполните это поле';
        }
        if (filters.priceFrom && filters.priceTo && parseInt(filters.priceFrom, 10) > parseInt(filters.priceTo, 10)) {
          newErrors.priceFrom = 'Цена от не должна быть больше Цена до';
        }
      
        setErrors(newErrors);
      
        return Object.keys(newErrors).length === 0;
      };
    
      const applyFilters = () => {
        if (validateFilters()) {
          const newParams: Record<string, string | boolean> = {};
          (Object.keys(filters) as (keyof Filters)[]).forEach((key) => {
            newParams[key] = filters[key];
          });
          updateParam(newParams);
        }
      };
    
    
      const handleResetFilters = () => {
        setFilters({
          priceFrom: '',
          priceTo: '',
          recommended: false,
          popular: false,
          rate: '',
        });
        resetParams();
        setErrors({})
      };    

    return (
      <div className="fixed-filter-panel">
        <Accordion className="filter-panel">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Фильтры</Typography>
          </AccordionSummary>
          <AccordionDetails className="filter-details">
            <div className="filter-inputs">
            <TextField
              label="Цена от"
              variant="outlined"
              value={filters.priceFrom}
              onChange={handleFilterChange}
              type="number"
              name="priceFrom"
              fullWidth
              margin="dense"
              error={!!errors.priceFrom}
              helperText={errors.priceFrom}
            />
            <TextField
              label="Цена до"
              variant="outlined"
              value={filters.priceTo}
              onChange={handleFilterChange}
              type="number"
              name="priceTo"
              fullWidth
              margin="dense"
              error={!!errors.priceTo}
              helperText={errors.priceTo}
            />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.recommended}
                    onChange={handleFilterChange}
                    name="recommended"
                  />
                }
                label="Рекомендуемые"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.popular}
                    onChange={handleFilterChange}
                    name="popular"
                  />
                }
                label="Популярные"
              />
              <TextField
                label="Оценка товара"
                variant="outlined"
                value={filters.rate}
                onChange={handleFilterChange}
                type="number"
                inputProps={{ min: 1, max: 5 }}
                name="rate"
                style={{width: '300px'}}
                margin="dense"
              />
              <div className="filter-buttons">
                <Button variant="contained" color="primary" onClick={applyFilters}>
                  Применить фильтры
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };