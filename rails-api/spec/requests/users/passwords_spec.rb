require 'rails_helper'

RSpec.describe 'Users::Passwords', type: :request do
  describe 'POST /password' do
    let(:user) { create(:user) }

    context 'with valid parameters' do
      it 'returns 201' do
        post user_password_url,
             params: { user: { email: user.email } }, as: :json
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid parameters' do
      it 'returns 422' do
        post user_password_url, params: { user: { email: nil } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
