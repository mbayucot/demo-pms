require 'rails_helper'

RSpec.describe ExportJob, type: :job do
  describe '#perform_later' do
    it 'exports a csv' do
      ActiveJob::Base.queue_adapter = :test
      export =
        Export.new(Faker::Number.number(digits: 10), User.to_s, User.all.to_sql)
      expect { described_class.perform_later(export) }.to have_enqueued_job
    end
  end
end
