import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [

  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'search',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../pages/search/search.module').then(m => m.SearchPageModule)
              }
            ]
          },
          {
            path: 'product-detail',
            loadChildren: () =>
              import('../pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
          }
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/cart/cart.module').then(m => m.CartPageModule)
          },
          {
            path: 'product-detail',
            loadChildren: () =>
              import('../pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
          },
          {
            path: 'order-confirm',
            loadChildren: () =>
              import('../pages/order-confirm/order-confirm.module').then(m => m.OrderConfirmPageModule)
          },
          {
            path: 'add-address',
            loadChildren: () =>
              import('../pages/add-address/add-address.module').then(m => m.AddAddressPageModule)
          },
          {
            path: 'order-contracts',
            loadChildren: () =>
              import('../pages/order-contracts/order-contracts.module').then(m => m.OrderContractsPageModule)
          }
        ]
      },
      {
        path: 'favorite',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/favorite/favorite.module').then(m => m.FavoritePageModule)
          },
          {
            path: 'product-detail',
            loadChildren: () =>
              import('../pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/profile/profile.module').then(
                m => m.ProfilePageModule
              )
          },
          {
            path: 'orders',
            loadChildren: () =>
              import('../pages/orders/orders.module').then(m => m.OrdersPageModule)

          },
          {
            path: 'returns',
            loadChildren: () =>
              import('../pages/returns/returns.module').then(m => m.ReturnsPageModule)
          },
          {
            path: 'personal-info',
            loadChildren: () =>
              import('../pages/personal-info/personal-info.module').then(m => m.PersonalInfoPageModule)
          },
          {
            path: 'addresses',
            loadChildren: () =>
              import('../pages/addresses/addresses.module').then(m => m.AddressesPageModule)
          },
          {
            path: 'add-address',
            loadChildren: () =>
              import('../pages/add-address/add-address.module').then(m => m.AddAddressPageModule)
          },
          {
            path: 'feedback',
            loadChildren: () =>
              import('../pages/feedback/feedback.module').then(
                m => m.FeedbackPageModule
              )
          },
          {
            path: 'info',
            loadChildren: () =>
              import('../pages/info/info.module').then(m => m.InfoPageModule)
          },
          {
            path: 'order-details',
            loadChildren: () =>
              import('../pages/order-details/order-details.module').then(m => m.OrderDetailsPageModule)
          },
          {
            path: 'return-details',
            loadChildren: () =>
              import('../pages/return-details/return-details.module').then(m => m.ReturnDetailsPageModule)
          },
          {
            path: 'return-submit',
            loadChildren: () =>
              import('../pages/return-submit/return-submit.module').then(m => m.ReturnSubmitPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
