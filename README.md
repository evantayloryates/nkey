### Initiate New Volume
  1. Remove existing machines
    -  `fly scale count 0`
  2. Remove existing volumes:
    - Get existing volume IDs with `fly vol list`
    - Run `fly vol destroy <VOLUME_ID>` for each id
  3. Create a new volume and get the ID (make sure to specify region)
    - `fly vol create <VOLUME_NAME> -s 1 --region lax`
    - Note: volume name can be whatever you want, but hold on to it for later
    - Get ID with `fly vol list`
  4. Start up a new machine with the new volume specified (again, make sure to specify region)
    - `fly m run . -v <VOLUME_ID>:<MOUNT_PATH> --region lax -n <DESIRED_NAME>`
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
    - get machine id with `fly m list`
    - get machine details with `fly m status <MACHINE_ID>`
  6. Update machine version metadata
    - `fly m update --metadata fly_platform_version=v2 <MACHINE_ID>`
    - Note: without this flag your machine cannot be deployed with the `deploy` command
  7. Update the machine's process group
    - `fly m update --metadata fly_process_group=app <MACHINE_ID>`
    - Note: without this flag your machine will be automatically deleted when you deploy
  8. Deply with `fly deploy`

### Upgrading to Consul lease
  1. After configuring the litefs.yml, attach your new consul cluster with `fly consul attach`

### Logging
1. Filter by:
  - (machine) `fly logs -i <MACHINE_ID>`
  - (region) `fly logs -r <REGION_ID>` (see all IDs with `fly platform regions`)
  - 