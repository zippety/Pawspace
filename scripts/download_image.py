import urllib.request
import ssl

# Create an SSL context that doesn't verify certificates (for this example only)
ssl._create_default_https_context = ssl._create_unverified_context

# URL of a large backyard with dogs playing from Unsplash
image_url = "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?q=80&w=2000&auto=format"

# Download the image
urllib.request.urlretrieve(image_url, "Z:/1Dog/(1)/Pawspace/public/dogs-playing.jpg")
