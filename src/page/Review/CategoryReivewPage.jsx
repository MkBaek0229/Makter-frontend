import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  currentPageState,
  filterState,
  cardInfoState,
  reviewRestaurantsState,
} from "../../state/reviewAtoms";
import { faArrowLeft, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeviceFrameset } from "react-device-frameset";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReviewCard from "../../components/Review/ReviewCard";

function CategoryReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurants = [] } = location.state || {};
  console.log("Fetched restaurants:", restaurants);

  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Recoil 상태 사용
  const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
  const [filter, setFilter] = useRecoilState(filterState);
  const [sortedRestaurants, setSortedRestaurants] = useRecoilState(
    reviewRestaurantsState
  );
  const [cardInfo, setCardInfo] = useRecoilState(cardInfoState);

  const itemsPerPage = 4;

  const handleIconClick = () => {
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 100);
  };

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.state) {
      setCardInfo({
        reviewCount: location.state.reviewCount,
        viewCount: location.state.viewCount,
        rating: location.state.rating,
      });
    }
  }, [location.state]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    let sortedArray = [...restaurants];
    switch (filter) {
      case "rating":
        sortedArray.sort((a, b) => b.rating - a.rating);
        break;
      case "reviewCount":
        sortedArray.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "viewCount":
        sortedArray.sort((a, b) => b.viewCount - a.viewCount);
        break;
      default:
        sortedArray = restaurants;
        break;
    }
    setSortedRestaurants(sortedArray);
  }, [filter, restaurants, setSortedRestaurants]);

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    navigate(`/review/category/${category}`);
  };

  return (
    <ReviewPage>
      <ReviewPageWrapper>
        <DeviceFrameset
          device="iPad Mini"
          color="black"
          width="100%"
          height="75%"
        >
          <StyledContainer>
            <GreenContainer>
              <FontAwesomeIcon icon={faUtensils} size="2x" />
            </GreenContainer>
            <Header>
              <BackButton to="/review/">
                <PressableIcon
                  icon={faArrowLeft}
                  size="xl"
                  onClick={handleIconClick}
                  pressed={isPressed ? "true" : undefined}
                />
              </BackButton>

              <FilterContainer>
                <FilterButton onClick={() => handleFilterChange("default")}>
                  기본 순
                </FilterButton>
                <FilterButton onClick={() => handleFilterChange("rating")}>
                  별점 높은 순
                </FilterButton>
                <FilterButton onClick={() => handleFilterChange("reviewCount")}>
                  리뷰 많은 순
                </FilterButton>
                <FilterButton onClick={() => handleFilterChange("viewCount")}>
                  찜 많은 순
                </FilterButton>
              </FilterContainer>
            </Header>
            <TagsContainer>
              {currentItems.map((restaurant, index) => (
                <div key={index}>
                  {restaurant.menus &&
                    restaurant.menus.length > 0 &&
                    restaurant.menus.map((menu, menuIndex) => (
                      <TagButton
                        key={menuIndex}
                        onClick={() => handleCategoryClick(menu)}
                      >
                        {menu}
                      </TagButton>
                    ))}
                </div>
              ))}
            </TagsContainer>
            <ReviewCardWrapper>
              <ReviewCardContainer>
                {currentItems.map((restaurant, index) => (
                  <ReviewCard key={index} restaurant={restaurant} />
                ))}
              </ReviewCardContainer>
            </ReviewCardWrapper>
            <Pagination>
              <PageButton
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                이전 페이지
              </PageButton>
              <PageButton
                onClick={handleNextPage}
                disabled={indexOfLastItem >= restaurants.length}
              >
                다음 페이지
              </PageButton>
            </Pagination>
          </StyledContainer>
        </DeviceFrameset>
      </ReviewPageWrapper>
    </ReviewPage>
  );
}

export default CategoryReviewPage;

// 스타일 컴포넌트 정의
const ReviewPage = styled.div`
  background: linear-gradient(#e7e78b, #f0f0c3);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 나머지 스타일 컴포넌트 정의는 동일합니다.

const ReviewPageWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 20px;
  border-radius: 10px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 10px 0;
`;

const BackButton = styled(Link)`
  position: absolute;
  left: 20px;
  padding: 5px;
  background-color: #e9e5a9;
  border-radius: 5px;
  color: #000;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4d19a;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  background-color: #e9e5a9;
  border: none;
  border-radius: 5px;
  color: #000;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4d19a;
  }

  &:focus {
    outline: none;
    background-color: #d4d19a;
  }
`;

const TagsContainer = styled.div`
  max-width: 100%;
  padding: 15px;
  height: auto;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-color: #e9e5a9;
  border-radius: 0 0 30px 30px;
`;

const TagButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  margin-left: 2px;
  background-color: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
  font-family: "Uiyeun", sans-serif;

  &:hover {
    background-color: #e9e5a9;
    color: #000;
  }
`;

const PressableIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.9);
  }
`;

const ReviewCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  overflow-y: auto;
`;

const ReviewCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 800px;
  width: 100%;
  height: 80%;
  overflow-y: auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #e9e5a9;
  border: none;
  border-radius: 5px;
  color: #000;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d4d19a;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
