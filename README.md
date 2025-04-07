<div align="center">

<!-- logo -->
<img src="https://github.com/user-attachments/assets/a54c9c6c-c7bd-40b4-8678-15bb8c013b81" />

### 맛케터 🖍️

[<img src="https://img.shields.io/badge/-readme.md-important?style=flat&logo=google-chrome&logoColor=white" />]()  
 [<img src="https://img.shields.io/badge/프로젝트 기간-2024.03.04~2024.12.05-fab2ac?style=flat&logo=&logoColor=white" />]()

</div>

## 📝 소개

맛케터는 대전의 음식점 정보를 안내하고 리뷰를 작성,확인하는 맛집 정보 웹 서비스입니다.

# 프로젝트 소개

    - 대전의 맛집정보를 찾고 리뷰를 작성하고 확인하는 서비스입니다.

<br />

### 프로젝트에서 담당한 Part

|                                                                                 맛집 탐색 페이지                                                                                  |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                     <img src="https://github.com/user-attachments/assets/e678778e-4b24-4631-a468-3b9229cc7747" width="1024"/>                                     |
| 카카오 지도를 통해 현재 위치의 지도 정보를 띄우고 데이터베이스에 저장되있는 맛집정보들을 렌더링하며 좌측의 슬라이더메뉴를 통해 식당정보를 확인하고 리뷰페이지로 이동할수있습니다. |

|                                                                                    인증 기반 접근 제어 화면                                                                                    |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                           <img src="https://github.com/user-attachments/assets/1045d3bb-8136-4532-876a-0618b469e411" width="1024"/>                                            |
| Recoil을 활용하여 전역적으로 인증상태를 관리하고, useEffect hook을 통해 컴포넌트 마운트 시 세션 정보를 조회하여 인증되지 않은 사용자에게 접근 제한을 적용하고 로그인 모달을 표시하고 있습니다. |

|                                                                              리뷰페이지                                                                              |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                              <img src="https://github.com/user-attachments/assets/78bc0b8a-3990-48ea-829d-d6dab08ef334" width="1024"/>                               |
| 사용자가 선택한 식당에 대한 리뷰 페이지 입니다. 개발당시 해시태그를 활용하여 리뷰를 빠르게 판독할수있도록 돕고 추가적인 2차 부가 컨텐츠로 활용하고자 제작하였습니다. |

<br />

## ⚙ 개발환경

### 기술 스택

<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/JavaScript.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/React.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/StyledComponents.png?raw=true" width="80">
<img src="https://github.com/user-attachments/assets/087a67c5-a38c-4af2-a2a5-1ae55aa46085" width="80">
<img src="https://github.com/user-attachments/assets/07d2217a-a10a-4e76-99e0-54d026edd30f" width="80">

</div>

### Tools

<img src="https://github.com/user-attachments/assets/b0a7e506-2ef8-4efd-b834-f273dd9be5d3" width="80">
<img src="https://github.com/user-attachments/assets/6124f982-3913-4d97-bf5b-ddd7963108d2" width="80">
</div>

<br />

## 🤔 기술적 이슈와 해결 과정 (트러블슈팅)

<details>
  <summary><b>카테고리 선택 후 새로고침 시 상태 초기화 문제</b></summary>
  <div markdown="1">
    ### 문제 상황
    CategoryReviewPage 컴포넌트에서 카테고리를 선택하여 맛집 목록을 보던 중, 브라우저 새로고침 시 빈 화면이 표시되는 현상이 발생했습니다. 이로 인해 사용자가 URL을 북마크하거나 공유할 경우 정상적인 페이지 접근이 불가능했습니다.
    ---
  
    ### 문제 원인
    
    1. **URL 파라미터 처리 부재**  
       React Router의 `useParams` 훅을 사용하지 않아 URL에서 카테고리 정보(`/review/category/:category`)를 추출하지 못합니다.
       ```jsx
       // 문제 코드
       import { Link, useNavigate } from "react-router-dom";
       // useParams를 임포트하지 않음
       
       function CategoryReviewPage() {
         const navigate = useNavigate();
         // URL에서 카테고리 파라미터를 추출하는 코드 부재
       }
       ```
    
    2. **페이지 로드 시 데이터 로딩 로직 부재**  
       페이지 마운트 시 API 호출을 통한 데이터 로딩 로직이 구현되어 있지 않아, 새로고침 시 초기 데이터가 로드되지 않습니다.
       ```jsx
       // 페이지 마운트 시 스크롤 이벤트만 처리됨
       useEffect(() => {
         window.addEventListener("scroll", handleScroll);
         return () => window.removeEventListener("scroll", handleScroll);
       }, []);
       ```
    
    3. **Recoil 상태 의존성**  
       컴포넌트가 Recoil의 `sortedRestaurants` 상태에만 의존하고 있어, 브라우저 새로고침 시 상태가 초기화(빈 배열)되어 데이터가 표시되지 않습니다.
       ```jsx
       // Recoil 상태에만 의존
       const [sortedRestaurants, setSortedRestaurants] = useRecoilState(reviewRestaurantsState);
       ```
    
    이러한 세 가지 문제가 복합적으로 작용하여, 페이지 새로고침 시 빈 화면이 표시되는 현상이 발생합니다.
  
  ## 해결 방법
    
    1. **URL 파라미터 처리 추가**  
       URL에서 카테고리 정보를 추출하기 위해 `useParams` 훅을 추가합니다.
       ```jsx
       // 추가할 임포트
       import { Link, useNavigate, useParams } from "react-router-dom";
       
       function CategoryReviewPage() {
         const navigate = useNavigate();
         const { category } = useParams(); // URL에서 카테고리 파라미터 가져오기
         
         // 기존 코드 유지...
       }
       ```
    
    2. **카테고리 기반 데이터 로딩 로직 추가**  
       페이지 마운트 시 카테고리에 따라 API를 호출하여 데이터를 불러옵니다.
       ```jsx
       useEffect(() => {
         if (!category) return;
         
         setIsLoading(true);
         fetch(`https://makter-backend.fly.dev/api/v1/restaurants?category=${category}`)
           .then((res) => res.json())
           .then((data) => {
             console.log("API 응답 데이터:", data);
             // 데이터를 처리하여 필요한 형식으로 변환
             const processedData = data.data.map(restaurant => ({
               ...restaurant,
               id: restaurant._id || restaurant.id  // API에 따라 ID 필드 처리
             }));
             
             setSortedRestaurants(processedData);
             setIsLoading(false);
           })
           .catch((error) => {
             console.error("데이터 로딩 실패:", error);
             setIsLoading(false);
           });
       }, [category, setSortedRestaurants]);
       ```
    
    3. **정렬 로직 최적화 - 무한 루프 방지**  
       필터 값에 따라 정렬을 수행하고, 변경사항이 있을 때만 상태를 업데이트합니다.
       ```jsx
       useEffect(() => {
         if (!sortedRestaurants.length) return;
         
         let sortedArray = [...sortedRestaurants];
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
             return; // 정렬 불필요시 종료
         }
         
         // 변경사항이 있을 때만 상태 업데이트 (무한 루프 방지)
         if (JSON.stringify(sortedArray) !== JSON.stringify(sortedRestaurants)) {
           setSortedRestaurants(sortedArray);
         }
       }, [filter, sortedRestaurants]);
       ```
    
    4. **로딩 및 에러 UI 추가**  
       로딩 중임을 사용자에게 알려주고, 에러 상황이나 데이터가 없는 경우에 대한 UI를 제공합니다.
       ```jsx
       return (
         <ReviewPage>
           <CenteredContainer>
             {isLoading && <LoadingBurger />}
             {/* 데이터가 없는 경우의 처리 로직 추가 */}
             {!isLoading && sortedRestaurants.length === 0 && (
               <EmptyContainer>
                 <EmptyText>해당 카테고리의 맛집 정보가 없습니다.</EmptyText>
                 <BackToMainButton onClick={() => navigate('/review')}>
                   메인으로 돌아가기
                 </BackToMainButton>
               </EmptyContainer>
             )}
             {/* 정상적인 데이터 렌더링 UI */}
           </CenteredContainer>
         </ReviewPage>
       );
       ```
       
  </div>
</details>
