require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  controller do
    include ExceptionHandler
    include Pageable

    def index
      collection =
        OpenStruct.new({ current_page: 1, total_pages: 1, total_entries: 15 })
      render json: pagination_dict(collection)
    end

    def create
      raise ActiveRecord::RecordInvalid, Project.new
    end

    def show
      raise ActiveRecord::RecordNotFound, Project.new
    end

    def destroy
      raise Pundit::NotAuthorizedError
    end
  end

  before do
    sign_in create(:user)

    routes.draw do
      get :index, to: 'anonymous#index'
      get :show, to: 'anonymous#show'
      post :create, to: 'anonymous#create'
      delete :destroy, to: 'anonymous#destroy'
    end
  end

  describe 'with pagination data' do
    it 'returns 200 and a pagination metadata', :aggregate_failures do
      get :index
      expect(response).to have_http_status(:ok)
      expect(json.with_indifferent_access).to match(
        { current_page: 1, total_pages: 1, total_count: 15 }
      )
    end
  end

  describe 'handling RecordNotFound exceptions' do
    it 'returns 404' do
      get :show
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'handling RecordInvalid exceptions' do
    it 'returns 422' do
      post :create
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'handling NotAuthorizedError exceptions' do
    it 'returns 403' do
      delete :destroy
      expect(response).to have_http_status(:forbidden)
    end
  end
end
