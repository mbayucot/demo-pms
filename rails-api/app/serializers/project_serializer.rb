class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at
  belongs_to :user, key: :client

  def filter(keys)
    if scope.client?
      keys - [:client]
    else
      keys
    end
  end
end
