require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe ApplicationCable::Connection, type: :channel do
  let(:user) { create(:user) }

  let(:valid_headers) { Devise::JWT::TestHelpers.auth_headers({}, user) }

  it 'successfully connects' do
    connect "/cable?uuid=#{Faker::Number.number(digits: 10)}",
            headers: valid_headers
    expect(connection.current_user.id).to eq user.id
  end

  it 'rejects connection' do
    expect { connect '/cable' }.to have_rejected_connection
  end
end
