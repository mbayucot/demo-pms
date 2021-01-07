class TaskSerializer < ActiveModel::Serializer
  attributes :id, :summary, :description, :status, :status_fmt, :created_at, :updated_at
  belongs_to :user, key: :assignee

  def status_fmt
    case object.status
    when 'pending'
      'To Do'
    when 'processing'
      'In Progress'
    when 'completed'
      'Done'
    else
      'To Do'
    end
  end
end
