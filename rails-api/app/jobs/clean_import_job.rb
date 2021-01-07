class CleanImportJob < ApplicationJob
  queue_as :default

  def perform
    Import.where('created_at < ?', 60.days.ago).destroy_all
  end
end
