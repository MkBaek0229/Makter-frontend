import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { reviewsState, isActiveState } from "../../state/reviewAtoms";
import styled from "styled-components";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams, useLocation } from "react-router-dom";
import RatingStars from "../../components/Review/RatingStars";
import ReviewList from "../../components/Review/ReviewList";
import WriteReview from "../../components/Review/WriteReview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faClock,
  faMapMarkerAlt,
  faBurger,
} from "@fortawesome/free-solid-svg-icons";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

function ReviewPage() {
  const location = useLocation();
  const restaurantInfo = { ...location.state };
  const { id } = useParams();

  const [reviews, setReviews] = useRecoilState(reviewsState);
  const [isActive, setIsActive] = useRecoilState(isActiveState);
  const lastId = useRef(4);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const fetchReviews = async (restaurant_Id) => {
    try {
      const response = await fetch(
        `https://makterbackend.fly.dev/api/v1/reviews/${restaurant_Id}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch reviews: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
    }
  };

  useEffect(() => {
    if (restaurantInfo.id) {
      fetchReviews(restaurantInfo.id);
    }
  }, [restaurantInfo.id]);

  const onSubmit = (username, content, hashtags, rating) => {
    const updatedReviews = [
      ...reviews,
      { id: lastId.current, username, content, hashtags, rating },
    ];

    setReviews(updatedReviews);
    lastId.current++;

    fetch("https://makterbackend.fly.dev/api/v1/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurant_id: id,
        contents: content,
        username: username,
        rating: rating,
        hashtags: hashtags,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to create review: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // 리뷰 작성 후 즉시 서버에서 리뷰 목록을 새로 가져오기
        fetchReviews(id);
        handleToggle();
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  const OnDelete = async (review_id) => {
    try {
      const response = await fetch(
        `https://makterbackend.fly.dev/api/v1/reviews/${review_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete review: ${response.statusText}`);
      }
      fetchReviews(id); // 삭제 후 서버에서 리뷰 목록을 새로 가져오기
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
  };

  return (
    <ReveiwP>
      <HeaderContainer>
        <Title>식당 리뷰</Title>
      </HeaderContainer>
      <Container>
        <ContentsContainer>
          <DeviceFrameset
            device="iPhone X"
            color="black"
            width="100%"
            height="100%"
          >
            <ImgSection $backgroundImage={restaurantInfo.image}>
              <CardSection>
                <CardTitle>{restaurantInfo.name}</CardTitle>
                <RatingStars rating={restaurantInfo.rating} />
                <ReviewPanel>
                  <ToggleContainer onClick={handleToggle}>
                    <ReviewButton $active={isActive}>
                      리뷰 {restaurantInfo.rating}
                    </ReviewButton>
                    <ReviewButton $active={!isActive}>리뷰 작성</ReviewButton>
                    <ToggleSlider $active={isActive} />
                  </ToggleContainer>
                </ReviewPanel>
              </CardSection>
            </ImgSection>
            <AdditionalInfoBox>
              <AdditionalInfo>
                <InfoIcon icon={faBurger} size="2x" />
                <InfoText>{restaurantInfo.category}</InfoText>
              </AdditionalInfo>
              <AdditionalInfo>
                <InfoIcon icon={faClock} size="2x" />
                <InfoText>영업 시간: {restaurantInfo.opening_hours}</InfoText>
              </AdditionalInfo>
              <AdditionalInfo>
                <InfoIcon icon={faMapMarkerAlt} size="2x" />
                <InfoText>위치: {restaurantInfo.address}</InfoText>
              </AdditionalInfo>
              <AdditionalInfo>
                <InfoIcon icon={faPhone} size="2x" />
                <InfoText>연락처: {restaurantInfo.phone}</InfoText>
              </AdditionalInfo>
            </AdditionalInfoBox>
          </DeviceFrameset>
        </ContentsContainer>
        <ReviewContainer>
          {isActive ? (
            <WriteReview onSubmit={onSubmit} />
          ) : (
            <ReviewList reviews={reviews} onDelete={OnDelete} />
          )}
        </ReviewContainer>
        <Carousel autoPlay />
      </Container>
    </ReveiwP>
  );
}

export default ReviewPage;

// Styled Components 유지

const ReveiwP = styled.div`
  background: linear-gradient(#f0f0c3, #e7e7c9);
`;

const Container = styled.div`
  max-width: 1280px;
  height: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 100px;
`;

const HeaderContainer = styled.header`
  max-width: 100%;
  padding: 0 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  background: linear-gradient(#e7e78b, #f0f0c3);
`;

const ReviewContainer = styled.main`
  max-width: 85%;
  min-height: 750px;
  margin-right: 40px;
  max-height: 750px;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 60px;
  background-color: white;
`;

const ReviewPanel = styled.div`
  height: 50px;
  width: 200px;
  border-radius: 50px;
  background-color: #cde8e5;
  display: flex;
`;

const ToggleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  background-color: #cde8e5;
`;

const ReviewButton = styled.button`
  flex: 1;
  font-size: 14px;
  font-weight: 900;
  border: none;
  border-radius: 50px;
  background-color: transparent;
  color: ${({ $active }) => ($active ? "#dd5746" : "black")};
  transition: color 0.5s ease-in-out;
  z-index: 1;
`;

const ToggleSlider = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: #f4ce14;
  border-radius: 50px;
  transition: transform 0.4s cubic-bezier(0.24, 0, 0.5, 1);
  transform: ${({ $active }) =>
    $active ? "translateX(50%)" : "translateX(-50%)"};
`;

const ContentsContainer = styled.div`
  max-width: 30%;
  height: 700px;
  flex: 1;
  border-radius: 50px;
`;

const ImgSection = styled.section`
  max-width: 100%;
  height: 300px;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 20px;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: bold;
  padding: 20px;
  margin: 0 auto;
  margin-right: 60px;
  flex: 1;
  text-align: center;
`;

const CardSection = styled.section`
  max-width: 340px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  z-index: 5;
  background-color: white;
  position: absolute;
  bottom: -100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding: 30px;
  box-shadow: rgba(10, 100, 90, 0.5) 0px 7px 29px 0px;
`;

const CardTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 10px;
`;

const AdditionalInfoBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
  position: absolute;
  width: 100%;
  bottom: 20px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.8);
`;

const AdditionalInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  font-size: 16px;

  &:hover {
    transform: translateY(-5px);
  }
`;

const InfoIcon = styled(FontAwesomeIcon)`
  margin-right: 10px;
  font-size: 24px;
  color: #555;
`;

const InfoText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;
