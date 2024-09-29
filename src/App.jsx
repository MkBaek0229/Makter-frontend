import React, { useEffect } from "react";
import Main from "./page/Main";
import KakaoMap from "../src/page/Map/KaKaoMap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/page/Map/Home";
import Header from "./page/Header";
import ServicePage from "./page/ServicePage";
import MainWritePage from "./page/Community/MainWritePage";
import MainListPage from "./page/Community/MainListPage";
import CategoryReviewPage from "./page/Review/CategoryReivewPage";
import ReviewPage from "./page/Review/ReviewPage";
import MainReviewPages from "./page/Review/MainReviewPages";
import EditPage from "./components/Community/EditPage";
import DetailPost from "./components/Community/DetailPost";

import ServiceFoods from "./components/ServiceFoods";
import Mypage from "./components/User/Mypage";
import ResetPasswordPage from "./components/User/ResetPassword";
function App() {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "https://makterbackend.fly.dev/api/v1/check-session",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();
        if (result.isAuthenticated) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (error) {
        setAuth(false);
      }
    };

    checkSession();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHN />} />
        <Route path="/food" element={<FoodHN />} />
        <Route path="/service" element={<ServiceHN />} />
        <Route path="/servicefoods" element={<ServiceFoodHN />} />
        <Route path="/review" element={<FullReviewHN />} />
        <Route path="/review/:id" element={<ReviewHN />} />
        <Route path="/MainListPage" element={<CommunityListHN />} />
        <Route path="/MainWritePage" element={<CommunityWriteHN />} />
        <Route path="/category/:category" element={<CategoryReviewHN />} />
        <Route path="/EditPage/:postId" element={<EditPageHN />} />
        <Route path="/Post/:postId" element={<DetailPostPageHN />} />
        <Route path="/mypage" element={<MypageHN />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const MainHN = () => (
  <div>
    <Header />
    <Main />
  </div>
);

const ReviewHN = () => (
  <div>
    <Header />
    <ReviewPage />
  </div>
);

const FullReviewHN = () => (
  <div>
    <Header />
    <MainReviewPages />
  </div>
);

const FoodHN = () => {
  return (
    <div>
      <Header />
      <Home />
      <KakaoMap />
    </div>
  );
};

const ServiceHN = () => (
  <div>
    <Header />
    <ServicePage />
  </div>
);

const ServiceFoodHN = () => (
  <div>
    <Header />
    <ServiceFoods />
  </div>
);

const CommunityListHN = () => (
  <div>
    <Header />
    <MainListPage />
  </div>
);

const CommunityWriteHN = () => (
  <div>
    <Header />
    <MainWritePage />
  </div>
);

const CategoryReviewHN = () => (
  <div>
    <Header />
    <CategoryReviewPage />
  </div>
);

const EditPageHN = () => (
  <div>
    <Header />
    <EditPage />
  </div>
);

const DetailPostPageHN = () => (
  <div>
    <Header />
    <DetailPost />
  </div>
);
const MypageHN = () => (
  <div>
    <Mypage />
  </div>
);
export default App;
