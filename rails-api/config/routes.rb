Rails.application.routes.draw do
  defaults format: :json do
    scope module: :v1 do
      resources :projects do
        resources :tasks, shallow: true
      end
    end
  end

  devise_for :users,
             path: '',
             path_names: {
               sign_in: 'login', sign_out: 'logout', registration: 'signup'
             },
             controllers: {
               sessions: 'users/sessions', registrations: 'users/registrations'
             },
             defaults: { format: :json }
end
