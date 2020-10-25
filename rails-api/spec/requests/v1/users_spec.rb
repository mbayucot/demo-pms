require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe '/v1/users', type: :request do
  let(:password) { Faker::Internet.password }
  let(:user) do
    create(:user, password: password, password_confirmation: password)
  end

  let(:valid_headers) do
    Devise::JWT::TestHelpers.auth_headers({ Accept: 'application/json' }, user)
  end

  describe 'GET /show' do
    before { get users_show_url, headers: valid_headers, as: :json }

    it 'returns 200' do
      expect(response).to have_http_status(:ok)
    end

    it 'returns a user' do
      expect(json).to include_json(first_name: user.first_name)
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) { { first_name: Faker::Name.first_name } }

      it 'updates the requested user' do
        patch users_update_url,
              params: new_attributes, headers: valid_headers, as: :json
        user.reload
        expect(user.first_name).to eq(new_attributes[:first_name])
      end

      it 'returns 200' do
        patch users_update_url,
              params: new_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters', :aggregate_failures do
      let(:invalid_attributes) { { email: nil } }

      it 'returns 422 with an error message' do
        patch users_update_url,
              params: invalid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('email': ["can't be blank"])
      end
    end

    context 'with valid avatar' do
      let(:avatar) { FilesTestHelper.png }
      let(:new_attributes) { { avatar: avatar } }

      it 'uploads the avatar' do
        expect do
          patch users_update_url, params: new_attributes, headers: valid_headers
        end.to change { ActiveStorage::Attachment.count }.by(1)
      end

      it 'updates the requested user', :aggregate_failures do
        patch users_update_url, params: new_attributes, headers: valid_headers
        user.reload
        expect(user.avatar).to be_attached
        expect(user.avatar.filename).to eq FilesTestHelper.png_name
      end

      it 'returns 200' do
        patch users_update_url, params: new_attributes, headers: valid_headers
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid avatar', :aggregate_failures do
      let(:avatar) { FilesTestHelper.pdf }
      let(:invalid_attributes) { { avatar: avatar } }

      it 'returns 422 with an error message' do
        patch users_update_url,
              params: invalid_attributes, headers: valid_headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('avatar': ['has an invalid content type'])
      end
    end
  end

  describe 'PATCH /update_password' do
    context 'with valid parameters' do
      let(:new_attributes) do
        new_password = Faker::Internet.password
        {
          current_password: password,
          password: new_password,
          password_confirmation: new_password
        }
      end

      it 'returns 200' do
        patch users_update_password_url,
              params: new_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters', :aggregate_failures do
      let(:invalid_attributes) do
        {
          current_password: Faker::Internet.password,
          password: Faker::Internet.password,
          password_confirmation: Faker::Internet.password
        }
      end

      it 'returns 422 with an error message' do
        patch users_update_password_url,
              params: invalid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('current_password': ['is invalid'])
      end
    end
  end
end