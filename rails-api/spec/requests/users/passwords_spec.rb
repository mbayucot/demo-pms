require 'rails_helper'

RSpec.describe 'Users::Passwords', type: :request do
  let(:client) { create(:user, :with_confirmed) }

  describe 'POST /password' do
    context 'with valid parameters' do
      it 'returns 201', :aggregate_failures do
        post user_password_url,
             params: { user: { email: client.email } }, as: :json
        expect(response).to have_http_status(:created)

        client.reload
        expect(client.reset_password_token).to be_truthy
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
