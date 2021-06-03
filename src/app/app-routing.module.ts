import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // {
  //   path: 'home',
  //   loadChildren: './pages/home/home.module#HomePageModule'
  // },
  // {
  //   path: "cart",
  //   loadChildren: "./pages/cart/cart.module#CartPageModule"
  // },
  // {
  //   path: "profile",
  //   loadChildren: "./pages/profile/profile.module#ProfilePageModule"
  // },
  // {
  //   path: "profile/feedback",
  //   loadChildren: "./pages/feedback/feedback.module#FeedbackPageModule"
  // },
  // {
  //   path: "profile/info",
  //   loadChildren: "./pages/info/info.module#InfoPageModule"
  // },
  // {
  //   path: "tabs/cart",
  //   redirectTo: "cart",
  //   pathMatch: "full"
  // },
  // {
  //   path: 'search',
  //   loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
  // },
  // { path: 'product-detail', loadChildren: './pages/product-detail/product-detail.module#ProductDetailPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  // { path: 'add-address', loadChildren: './pages/add-address/add-address.module#AddAddressPageModule' },
  // { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' },
  // { path: 'image-model', loadChildren: './pages/image-model/image-model.module#ImageModelPageModule' },
  // { path: 'addresses', loadChildren: './pages/addresses/addresses.module#AddressesPageModule' },
  // { path: 'personal-info', loadChildren: './pages/personal-info/personal-info.module#PersonalInfoPageModule' },
  // { path: 'favorite', loadChildren: './pages/favorite/favorite.module#FavoritePageModule' },
  // { path: 'orders', loadChildren: './pages/orders/orders.module#OrdersPageModule' },
  // { path: 'order-details', loadChildren: './pages/order-details/order-details.module#OrderDetailsPageModule' },
  { path: 'info', loadChildren: './pages/info/info.module#InfoPageModule' },
  // { path: 'order-confirm', loadChildren: './pages/order-confirm/order-confirm.module#OrderConfirmPageModule' },
  // { path: 'feedback', loadChildren: './pages/feedback/feedback.module#FeedbackPageModule' },
  // { path: 'filter-model', loadChildren: './pages/filter-model/filter-model.module#FilterModelPageModule' },
  // { path: 'returns', loadChildren: './pages/returns/returns.module#ReturnsPageModule' },
  // { path: 'return-details', loadChildren: './pages/return-details/return-details.module#ReturnDetailsPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  // { path: 'return-submit', loadChildren: './pages/return-submit/return-submit.module#ReturnSubmitPageModule' },
  // { path: 'order-contracts', loadChildren: './pages/order-contracts/order-contracts.module#OrderContractsPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
