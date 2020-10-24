require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe '/admin/projects', type: :request do
  let(:user) { create(:user) }
  let(:admin) { create(:user, role: :admin) }

  let!(:projects) { create_list(:project, 15, created_by: user.id) }
  let(:project) { projects.first }

  let(:valid_attributes) { { name: Faker::Lorem.word } }
  let(:invalid_attributes) { { name: nil } }

  let(:valid_headers) do
    Devise::JWT::TestHelpers.auth_headers({ Accept: 'application/json' }, admin)
  end

  describe 'GET /index' do
    before { get projects_url, headers: valid_headers, as: :json }

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

  describe 'GET /show' do
    context 'with valid parameters' do
      before { get project_url(project), headers: valid_headers, as: :json }

      it 'returns 200' do
        expect(response).to have_http_status(:ok)
      end

      it 'returns a project' do
        expect(json).to include_json(name: project.name)
      end
    end

    context 'with invalid parameters' do
      it 'returns 404' do
        get project_url(id: 0), headers: valid_headers, as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'PATCH /update' do
    context 'with valid parameters' do
      let(:new_attributes) { { name: Faker::Lorem.word } }

      it 'updates the requested project' do
        patch project_url(project),
              params: new_attributes, headers: valid_headers, as: :json
        project.reload
        expect(project.name).to eq(new_attributes[:name])
      end

      it 'returns 200' do
        patch project_url(project),
              params: new_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid parameters', :aggregate_failures do
      it 'returns 422 with an error message' do
        patch project_url(project),
              params: invalid_attributes, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json).to include_json('name': ["can't be blank"])
      end
    end
  end

  describe 'DELETE /destroy' do
    it 'destroys the requested project' do
      expect do
        delete project_url(project), headers: valid_headers, as: :json
      end.to change(Project, :count).by(-1)
    end

    it 'returns 204' do
      delete project_url(project), headers: valid_headers, as: :json
      expect(response).to have_http_status(:no_content)
    end
  end
end
