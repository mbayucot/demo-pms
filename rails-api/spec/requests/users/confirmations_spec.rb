require 'rails_helper'

RSpec.describe 'Users::Confirmations', type: :request do
  let(:client) { create(:user) }

  describe 'GET /confirmation' do
    context 'with valid parameters' do
      it 'updates the confirmation status', :aggregate_failures do
        get user_confirmation_url(confirmation_token: client.confirmation_token),
            as: :json
        expect(response).to have_http_status(:ok)

        client.reload
        expect(client.confirmed?).to eq(true)
      end
    end

    context 'with invalid parameters' do
      it 'returns 422' do
        get user_confirmation_url(confirmation_token: nil), as: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
