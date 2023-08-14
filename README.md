### Initiate New Volume
  1. Remove existing machines
    -  `fly scale count 0 -a <APP_NAME>`
  2. Remove existing volumes:
    - Get existing volume IDs with `fly vol list -a <APP_NAME>`
    - Run `fly vol destroy <VOLUME_ID>` for each id
  3. Create a new volume and get the ID (make sure to specify region)
    - `fly vol create <VOLUME_NAME> -s 1 --region lax -a <APP_NAME>`
    - Note: volume name can be whatever you want, but hold on to it for later
    - Get ID with `fly vol list`
  4. Start up a new machine with the new volume specified (again, make sure to specify region)
    - `fly m run . -v <VOLUME_ID>:<MOUNT_PATH> --region lax -n <DESIRED_NAME> -a <APP_NAME>`
    - Note: `-n <DESIRED_NAME>` is optional
    - Note: "MOUNT_PATH" should be the location in your machine's filesystem where the volume
            is expected to be mounted. So, if your fly config looks like this:
            ```
            [mounts]
              source = "data"
              destination = "/data"
            ```
            you'll want your mount path to be /data
  5. Validate your new machine
    - get machine id with `fly m list -a <APP_NAME>`
    - get machine details with `fly m status <MACHINE_ID> -a <APP_NAME>`
  6. Update machine version metadata
    - `fly m update -y --metadata fly_platform_version=v2 <MACHINE_ID> -a <APP_NAME>`
    - Note: without this flag your machine cannot be deployed with the `deploy` command
  7. Update the machine's process group
    - `fly m update -y --metadata fly_process_group=app <MACHINE_ID> -a <APP_NAME>`
    - Note: without this flag your machine will be automatically deleted when you deploy
  8. Attach Consul lease (if this is first time)
    - After configuring the litefs.yml, attach your new consul cluster with `fly consul attach -a <APP_NAME>`
  9. Deploy with `fly deploy -a <APP_NAME>`

### Logging
1. Filter by:
  - (machine) `fly logs -i <MACHINE_ID>`
  - (region) `fly logs -r <REGION_ID>` (see all IDs with `fly platform regions`)

### Build and Run Locally
`docker container rm -f nkey-app ; docker image rm nkey:latest`
`docker build -t nkey:latest -f Dockerfile.dev .`
`docker container rm -f nkey-app ; docker run -p 3000:8081 -p 3001:3001 -v nkey-db:/data/litefs -v $(pwd)/app:/app/app -v $(pwd)/prisma:/app/prisma -v nkey-packages:/app/node_modules --name nkey-app nkey:latest`
### SSH Into Container
`docker exec -it nkey-app /bin/bash`
### Kill container
`docker kill nkey-app`
