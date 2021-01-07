require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe '/v1/tasks', type: :request do
  let(:user) { create(:user) }

  let(:project) { create(:project, created_by: user.id) }

  let!(:tasks) { create_list(:task, 15, project_id: project.id) }
  let(:task) { tasks.first }

  let(:valid_attributes) do
    { summary: Faker::Lorem.sentence, description: Faker::Lorem.sentence }
  end

  let(:invalid_attributes) { { summary: nil, description: nil } }

  let(:valid_headers) do
    Devise::JWT::TestHelpers.auth_headers({ Accept: 'application/json' }, user)
  end

  describe 'GET /projects/:project_id/tasks/index' do
    context 'with valid parameters' do
      before do
        get project_tasks_url(project), headers: valid_headers, as: :json
      end

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a paginated result' do
        expect(json['entries'].size).to eq(10)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 2, 'total_count': 15
        )
      end
    end

    context 'with search parameter' do
      before do
        get project_tasks_url(project_id: project.id, by_query: task.summary),
            headers: valid_headers, as: :json
      end

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a search result' do
        expect(json['entries'].size).to eq(1)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 1, 'total_count': 1
        )
      end
    end

    context 'with status parameter' do
      before do
        get project_tasks_url(project_id: project.id, by_status: 1),
            headers: valid_headers, as: :json
      end

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a search result' do
        expect(json['entries'].size).to eq(0)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 1, 'total_count': 0
        )
      end
    end

    context 'with sort parameters' do
      before do
        get project_tasks_url(
          project_id: project.id,
          by_sort: { column: 'summary', direction: 'desc' }
        ), headers: valid_headers, as: :json
      end

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a search result' do
        expect(json['entries'].size).to eq(10)
      end

      it 'returns a pagination metadata' do
        expect(json['meta']).to include_json(
          'current_page': 1, 'total_pages': 2, 'total_count': 15
        )
      end
    end

    context 'with invalid parameters' do
      it 'returns 404' do
        get project_tasks_url(project_id: 0), headers: valid_headers, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'GET /show' do
    context 'with valid parameters' do
      before { get task_url(task), headers: valid_headers, as: :json }

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a task' do
        expect(response.body).to eq(ActiveModelSerializers::SerializableResource.new(task).to_json)
      end
    end

    context 'with invalid parameters' do
      it 'returns 404' do
        get task_url(id: 0), headers: valid_headers, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /projects/:project_id/tasks/create' do
    context 'with valid parameters' do
      it 'creates a new Task' do
        expect do
          post project_tasks_url(project),
               params: valid_attributes, headers: valid_headers, as: :json
        end.to change(Task, :count).by(1)
      end

      it 'returns 201' do
        post project_tasks_url(project),
             params: valid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new Task' do
        expect do
          post project_tasks_url(project),
               params: { task: invalid_attributes }, as: :json
        end.to change(Task, :count).by(0)
      end

      it 'returns 422 with an error message', :aggregate_failures do
        post project_tasks_url(project),
             params: invalid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('summary': ["can't be blank"])
      end
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) { { summary: Faker::Lorem.sentence } }

      it 'updates the requested task' do
        patch task_url(task),
              params: new_attributes, headers: valid_headers, as: :json
        task.reload
        expect(task.summary).to eq(new_attributes[:summary])
      end

      it 'returns 200' do
        patch task_url(task),
              params: new_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters', :aggregate_failures do
      it 'returns 422 with an error message' do
        patch task_url(task),
              params: invalid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('summary': ["can't be blank"])
      end
    end
  end

  describe 'DELETE /destroy' do
    it 'destroys the requested task' do
      expect do
        delete task_url(task), headers: valid_headers, as: :json
      end.to change(Task, :count).by(-1)
    end

    it 'returns 204' do
      delete task_url(task), headers: valid_headers, as: :json
      expect(response).to have_http_status(:no_content)
    end
  end

  describe 'POST /projects/:project_id/tasks/import' do
    context 'with valid parameters' do
      let(:valid_attributes) do
        {
          uuid: Faker::Number.number(digits: 10),
          file: FilesTestHelper.csv
        }
      end

      it 'creates new import' do
        expect do
          post import_project_tasks_url(project),
               params: valid_attributes, headers: valid_headers
        end.to change(Import, :count).by(1)
      end

      it 'returns 201' do
        post import_project_tasks_url(project),
             params: valid_attributes, headers: valid_headers
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) { { uuid: nil } }

      it 'does not create a new Import' do
        expect do
          post import_project_tasks_url(project), params: { task: invalid_attributes }
        end.to change(Import, :count).by(0)
      end

      it 'returns 422 with an error message', :aggregate_failures do
        post import_project_tasks_url(project),
             params: invalid_attributes, headers: valid_headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('uuid': ["can't be blank"])
      end
    end
  end
end
