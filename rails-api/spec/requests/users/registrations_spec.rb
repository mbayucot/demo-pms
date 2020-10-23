require 'rails_helper'

RSpec.describe 'Users::Registrations', type: :request do
  let(:user) { build(:user) }

  let(:valid_attributes) do
    user.slice(:email, :password, :password_confirmation)
  end
  let(:invalid_attributes) { { email: Faker::Internet.email, password: nil } }

  describe 'POST /signup' do
    context 'with valid parameters' do
      it 'creates a new User' do
        expect do
          post user_registration_url,
               params: { user: valid_attributes }, as: :json
        end.to change(User, :count).by(1)
      end

      it 'returns 201 with an authorization token', :aggregate_failures do
        post user_registration_url,
             params: { user: valid_attributes }, as: :json
        expect(response).to have_http_status(:created)
        expect(response.headers).to have_key('Authorization')
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new User' do
        expect do
          post user_registration_url,
               params: { user: invalid_attributes }, as: :json
        end.to change(User, :count).by(0)
      end

      it 'returns 422 with an error message', :aggregate_failures do
        post user_registration_url,
             params: { user: invalid_attributes }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to match('password' => ["can't be blank"])
      end
    end
  end
end
