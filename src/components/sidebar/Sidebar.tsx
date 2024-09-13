import './index.scss';
import { FC, useContext, useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ProductsContext } from '../../context/ProductContext';
import { GroupProductType } from '../../types/ProductTypes';
import { RxCross2 } from 'react-icons/rx';
import { useUrlParams } from '../../context/UrlParamContext';

interface SidebarType {
  isOpen: boolean;
}

export const Sidebar: FC<SidebarType> = ({ isOpen }) => {

  const [subitems, setSubitems] = useState<GroupProductType[]>([]);
  const { state: {categories, groupProducts} } = useContext(ProductsContext);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("");
  const { updateParam } = useUrlParams();

 // const {dispatch} = useContext(ProductsContext)

  const setCategory = (v: string) => {
    console.log(v)
   // dispatch(filterProducts(v));
  }


  const handleGroupParams = (id: string) => {
    updateParam({'group': id})
  }


  const handleMouseEnter = (id: string) => {
    const filteredGroupsByCategoryId = groupProducts?.filter((grP) => grP.categoryId === id)
    setSubitems(filteredGroupsByCategoryId);
    setShowSubtitles(true);
    setActiveItem(id)
  };

  const sidebarStyle = {
    transition: 'left 300ms ease-in-out, top 300ms ease-in-out',
    left: isOpen ? 0 : -253,
    top: 92
  };

  useEffect(() => {
    if (!isOpen) {
      setShowSubtitles(false)
    }
  }, [isOpen])

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     setScrollOffset(Math.min(scrollY, 91.2));
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // useEffect(() => {
  //   if (!isOpen) {
  //     setSubitems([])
  //     setShowSubtitles(false);
  //   }
  // }, [isOpen])


  return (
    <div className="sidebar" style={{ ...sidebarStyle }}>
  <div className="sidebar__container">
    <div className="categories__container">
      {categories?.map((c) => (
        <div
          key={c.id}
          className="category-block"
          onMouseEnter={() => handleMouseEnter(c.id)}
          onClick={() => setCategory(c.name)}
        >
          <div className={`category-content ${c.id === activeItem ? "active" : ''}`}>
            <div className="title" >
              <span>{c.name}</span>
            </div>
            {c.id === activeItem && <div>
              <ArrowForwardIcon fontSize="small"/>
            </div>}
          </div>
        </div>
      ))}
    </div>
    {showSubtitles && (
      <div className="subtitles__container">
        <RxCross2 className='icon-close' onClick={() => setShowSubtitles(false)}/>
        {subitems?.map((subitem, index) => (
          <div className='subtitles__content' onClick={() => handleGroupParams(subitem.id)} key={subitem.id}>
            <div key={`${index}-subtitles`}>
            <span>{subitem.name}</span>
          </div>
          <div>
            <ArrowForwardIcon fontSize="small" className="icon-arrow"/>
          </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  );
};
