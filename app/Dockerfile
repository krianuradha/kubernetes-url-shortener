# ── Stage: Use official Node.js LTS image as base ──────────────────────────
# alpine = a very small Linux distro (~5MB), keeps our image tiny
FROM node:20-alpine

# Set the working directory INSIDE the container
# All subsequent commands run from here
WORKDIR /app

# Copy package.json and package-lock.json FIRST (before copying source code)
# Why? Docker caches layers. If only server.js changes, npm install won't re-run.
# This is a standard Docker optimization called "layer caching".
COPY package*.json ./

# Install ONLY production dependencies (skip devDependencies)
RUN npm install --omit=dev

# Now copy the rest of our application source code
COPY server.js ./

# Tell Docker that our app listens on port 3000
# This is documentation — it does not actually open the port
EXPOSE 3000

# The command that runs when the container starts
CMD ["node", "server.js"]
