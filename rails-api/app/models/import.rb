class Import < ApplicationRecord
  belongs_to :user

  has_one_attached :file

  validates :klass, presence: true
  validates :uuid, presence: true
  validates :file, attached: true, content_type: 'text/csv'

  after_create_commit { |import| ImportJob.perform_later(import) }
end
