module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      authorization = request.headers['Authorization']
      reject_unauthorized_connection unless authorization

      token = authorization&.gsub(/^Bearer /, '')
      if verified_user =
           Warden::JWTAuth::UserDecoder.new.call(token, :user, nil)
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
