import UserAccess from "@/commons/constants/userAccess"

export default function ({ route, store, redirect, next }) {
  const { REDIRECT_ROUTE } = UserAccess;
  const currentRoute = route;
  const userRole = localStorage.getItem("user_kind");
  let newPath = "";

  REDIRECT_ROUTE.forEach(item => {
    if(item?.routeName === currentRoute?.name && item?.roles.includes(userRole)){
      newPath = item?.newPath;
    }
  })
  if (userRole === "teacher" && currentRoute?.name === "Dashboard-Reviews") {
    newPath = "/dashboard/classroom";  
  }

  if (newPath) {
    return redirect(newPath);
  }
}