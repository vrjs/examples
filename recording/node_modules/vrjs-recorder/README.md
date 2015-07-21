# vrjs - recorder
recorder tracks a set of object positions and orientations.  Past p & o can be queried during runtime to facilitate history-based interaction techniques and behavious.

P & O data is stored continuously at user-defined intervals.  Records are stored to an in-memory [NeDB](https://github.com/louischatriot/nedb) data store.

P & O data is indexed by object name and time stamp to provide fast query history.  For application that do not require query, indexing can be disabled to allow for faster updates.

By default P & O data is lost when the application shuts down (its an in-memory database), but P & O data can be stored to files by calling `persist(filename)`.  This operation is relatively slow, it should not be called during the frame update cycle!

Under normal operation, recorder should only be collecting data for short periods of time - as over time memory consumption could grow too high.  Alternatively, when creating a recorder you can specify the `log: true` option to instead make all recordings go to disk using [nedb logger](https://github.com/louischatriot/nedb-logger) instead.  Latency on writes needs to be considered in this use case.