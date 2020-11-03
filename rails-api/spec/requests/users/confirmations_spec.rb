require 'rails_helper'

RSpec.describe 'Users::Confirmations', type: :request do
  let(:user) { create(:user) }

  describe 'GET /confirmation' do
    context 'with valid parameters' do
      it 'returns 200' do
        get user_confirmation_url(confirmation_token: user.confirmation_token),
            as: :json

        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters' do
      it 'returns 422' do
        post user_confirmation_url(confirmation_token: nil), as: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
