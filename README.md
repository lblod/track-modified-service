# Add Modified Service

Service that adds a dct:modified timestamp on a subject whenever a delta comes in for that subject.

The types for which a dct:modified is added can be configured in the json file located in the config directory.

The service can be configured using the following exports in the config folder (see included config for examples):

- **interestingTypes**: an array of types. The dct:modified will be set for Subjects with these types. If empty, all types will be considered.
- **filterModifiedSubjects**: an (optional) filter on the query of which subjects to update the modified for. The query contains ?subject, ?type, ?modified (current value, optional) and ?g as variables
- **filterDeltas**: a function that filters the deltas to act upon. By default, we won't change the modified for a subject if any delta triple (insert or delete) contains a modified for that subject.

This service also has the ability to clean up duplicate modified dates periodically. It does this using a cron job that you can activate by setting the env variable `CLEANUP_DUPLICATES_CRON` to a cron string. You can also clean up at start by setting the env variable `CLEANUP_AT_START` to true. This cleanup process keeps the most recent dct:modified value for any given subject. If there are different modified values in different graphs, it keeps the most recent one and overwrites the older value in the other graphs to this one.

> [!CAUTION]
> It is possible that we do not receive all deltas related to a change (if the change is split over multiple queries) and therefore might miss the modification date set by the application if it came in another batch of deltas. In that case the modified will still be updated. One can use batching in the delta notifier to mitigate this issue, but it will never completely go away.
