class TaskSerializer < ActiveModel::Serializer
  attributes :id, :summary, :description, :status
end
