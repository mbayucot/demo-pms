class V1::TasksController < ApplicationController
  before_action :set_project, only: %i[index create]
  before_action :set_task, only: %i[show update destroy]

  has_scope :by_query
  has_scope :by_status
  has_scope :by_sort, using: %i[column direction], type: :hash

  # GET /v1/projects/:project_id/tasks
  def index
    @tasks = apply_scopes(@project.tasks).paginate(page: params[:page])

    render json: @tasks,
           meta: pagination_dict(@tasks),
           adapter: :json,
           root: 'entries'
  end

  # GET /v1/tasks/1
  def show
    render json: @task
  end

  # POST /v1/projects/:project_id/tasks
  def create
    @task = authorize @project.tasks.create!(task_params)

    render json: @task, status: :created
  end

  # PATCH/PUT /v1/tasks/1
  def update
    @task.update!(task_params)

    render json: @task
  end

  # DELETE /v1/tasks/1
  def destroy
    @task.destroy
  end

  # POST /v1/projects/:project_id/tasks/import
  def import
    @user = current_user
    @import =
      authorize @user.imports.create!(import_params.merge(klass: Task.to_s, params: {
        project_id: params[:project_id]
      }.to_json))

    render json: @import, status: :created
  end

  private

  def set_project
    @project = policy_scope(Project).find(params[:project_id])
    authorize @project
  end

  def set_task
    @task = policy_scope(Task).find(params[:id])
    authorize @task
  end

  def task_params
    params.fetch(:task, {}).permit(:summary, :description, :status)
  end

  def import_params
    params.permit(:uuid, :file)
  end
end
