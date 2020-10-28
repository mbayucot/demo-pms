require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe '/admin/users', type: :request do
  let!(:users) { create_list(:user, 15, role: :admin) }
  let(:user) { users.first }

  let(:valid_attributes) do
    {
      email: Faker::Internet.email,
      password: 'pass1234',
      password_confirmation: 'pass1234',
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name
    }
  end
  let(:invalid_attributes) { { email: Faker::Name.first_name, password: nil } }

  let(:valid_headers) do
    Devise::JWT::TestHelpers.auth_headers({ Accept: 'application/json' }, user)
  end

  describe 'GET /index' do
    context 'with no parameter' do
      before { get admin_users_url, headers: valid_headers, as: :json }

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a paginated result' do
        expect(json['entries'].size).to eq(10)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 2, 'total_count': 15
        )
      end
    end

    context 'with search parameter' do
      before do
        get admin_users_url(by_query: user.email),
            headers: valid_headers, as: :json
      end

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a search result' do
        expect(json['entries'].size).to eq(1)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 1, 'total_count': 1
        )
      end
    end

    context 'with role parameter' do
      before do
        get admin_users_url(by_role: 0), headers: valid_headers, as: :json
      end

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a search result' do
        expect(json['entries'].size).to eq(0)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 1, 'total_count': 0
        )
      end
    end

    context 'with sort parameters' do
      before do
        get admin_users_url(by_sort: { column: 'email', direction: 'desc' }),
            headers: valid_headers, as: :json
      end

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a search result' do
        expect(json['entries'].size).to eq(10)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 2, 'total_count': 15
        )
      end
    end
  end

  describe 'GET /show' do
    context 'with valid parameters' do
      before { get admin_user_url(user), headers: valid_headers, as: :json }

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a user' do
        expect(json).to include_json(email: user.email)
      end
    end

    context 'with invalid parameters' do
      it 'returns 404' do
        get admin_user_url(id: 0), headers: valid_headers, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /create' do
    context 'with valid parameters' do
      it 'creates a new User' do
        expect do
          post admin_users_url,
               params: valid_attributes, headers: valid_headers, as: :json
        end.to change(User, :count).by(1)
      end

      it 'returns 201' do
        post admin_users_url,
             params: valid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new User' do
        expect do
          post admin_users_url,
               params: invalid_attributes, headers: valid_headers, as: :json
        end.to change(User, :count).by(0)
      end

      it 'returns 422 with an error message', :aggregate_failures do
        post admin_users_url,
             params: invalid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('email': ['is invalid'])
      end
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) { { first_name: Faker::Name.first_name } }

      it 'updates the requested user' do
        patch admin_user_url(user),
              params: new_attributes, headers: valid_headers, as: :json
        user.reload
        expect(user.first_name).to eq(new_attributes[:first_name])
      end

      it 'returns 200' do
        patch admin_user_url(user),
              params: new_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters', :aggregate_failures do
      it 'returns 422 with an error message' do
        patch admin_user_url(user),
              params: invalid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('email': ['is invalid'])
      end
    end
  end

  describe 'DELETE /destroy' do
    it 'destroys the requested user' do
      expect do
        delete admin_user_url(user), headers: valid_headers, as: :json
      end.to change(User, :count).by(-1)
    end

    it 'returns 204' do
      delete admin_user_url(user), headers: valid_headers, as: :json
      expect(response).to have_http_status(:no_content)
    end
  end
end
