Rails.application.routes.draw do
  defaults format: :json do
    scope module: :v1 do
      resources :projects do
        resources :tasks, shallow: true do
          collection { post :import }
        end
      end

      namespace :users do
        get :index
        get :show
        patch :update
        patch :update_password
        delete :destroy_avatar
      end
    end

    namespace :admin do
      resources :projects do
        resources :tasks, shallow: true
      end

      resources :users
    end
  end

  devise_for :users,
             path: '',
             path_names: {
               sign_in: 'login',
               sign_out: 'logout',
               registration: 'signup',
               confirmation: 'confirmation',
               password: 'password'
             },
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations',
               confirmations: 'users/confirmations',
               passwords: 'users/passwords'
             },
             defaults: { format: :json }
end
