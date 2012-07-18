desc "Generate a new post"
task :post do
  raise "Usage: provide a post file name; e.g., NAME=custom-rake-tasks.markdown" unless ENV['NAME']

  filename = "_posts/#{Time.new.strftime('%Y-%m-%d')}-#{ENV['NAME']}.markdown"
  File.open(filename, 'w') do |file|
    file << "---\n"
    file << "layout: post\n"
    file << "title: \"TITLE\"\n"
    file << "excerpt: \"EXCERPT\"\n"
    file << "---\n\n\n"
  end
end

task :default => :post