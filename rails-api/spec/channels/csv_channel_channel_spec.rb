require 'rails_helper'

RSpec.describe CsvChannel, type: :channel do
  let(:user) { create(:user) }
  let(:uuid) { Faker::Number.number(digits: 10) }

  before { stub_connection current_user: user }

  it 'rejects when uuid is invalid' do
    subscribe(uuid: nil)

    expect(subscription).to be_rejected
  end

  it 'subscribes to a stream when uuid is provided', :aggregate_failures do
    subscribe(uuid: uuid)

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("csv_channel_#{uuid}")
  end
end
