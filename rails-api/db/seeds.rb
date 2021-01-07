# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

password = 'YfGjIk0hGzDqS0'
(1..20).each do |id|
  User.create(id: id,
              email: Faker::Internet.email,
              password: password,
              password_confirmation: password,
              first_name: Faker::Name.first_name,
              last_name: Faker::Name.last_name,
              role: %w[client admin staff].sample)
end

(1..30).each do |id|
  Project.create!(
    id: id,
    name: Faker::Company.unique.name,
    created_by: User.where(role: :client).pluck(:id).sample,
  )
end

(1..60).each do |id|
  Task.create!(
    id: id,
    project_id: rand(1...20),
    summary: Faker::Lorem.unique.sentence,
    description: Faker::Lorem.unique.paragraph,
    status: %w[pending processing completed].sample,
    assigned_to: User.where(role: :staff).pluck(:id).sample,
  )
end