FactoryBot.define do
  factory :task do
    summary { Faker::Lorem.sentence }
    description { Faker::Lorem.sentence }
    project
    user
  end
end
