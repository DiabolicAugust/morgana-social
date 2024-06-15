import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch() // No exception type means catch all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly pgErrorMessages = {
    _bt_check_unique: 'Document with these parameters already exists!',
    pg_strtoint32_safe: 'You must pass a value of type number, not string!',
    unique_violation: 'A unique constraint violation occurred!',
    foreign_key_violation: 'A foreign key constraint violation occurred!',
    not_null_violation: 'A not-null constraint violation occurred!',
    check_violation: 'A check constraint violation occurred!',
    exclusion_violation: 'An exclusion constraint violation occurred!',
    invalid_text_representation: 'Invalid input syntax for type!',
    numeric_value_out_of_range: 'Numeric value out of range!',
    string_data_right_truncation: 'String data right truncation!',
    division_by_zero: 'Division by zero is not allowed!',
    deadlock_detected: 'A deadlock was detected!',
    lock_not_available: 'A lock is not available!',
    insufficient_resources: 'Insufficient resources to complete operation!',
    disk_full: 'The disk is full!',
    out_of_memory: 'Out of memory!',
    object_in_use: 'The object is currently in use!',
    cannot_coerce: 'Cannot coerce the given input!',
    undefined_function: 'The function is undefined!',
    invalid_parameter_value: 'Invalid parameter value!',
    undefined_table: 'The table is undefined!',
    undefined_column: 'The column is undefined!',
    undefined_object: 'The object is undefined!',
    duplicate_table: 'A table with the same name already exists!',
    duplicate_column: 'A column with the same name already exists!',
    duplicate_object: 'An object with the same name already exists!',
    syntax_error: 'There is a syntax error in the SQL statement!',
    undefined_database: 'The database is undefined!',
    invalid_cursor_state: 'The cursor is in an invalid state!',
    invalid_transaction_state: 'The transaction is in an invalid state!',
    active_sql_transaction: 'There is an active SQL transaction!',
    no_active_sql_transaction: 'There is no active SQL transaction!',
    in_failed_sql_transaction: 'The SQL transaction has failed!',
    idle_in_transaction_session_timeout: 'Idle transaction session timeout!',
    read_only_sql_transaction: 'The SQL transaction is read-only!',
    serialization_failure: 'Serialization failure!',
    statement_completion_unknown: 'Statement completion unknown!',
    triggered_action_exception: 'Triggered action exception!',
    data_exception: 'Data exception!',
    integrity_constraint_violation: 'Integrity constraint violation!',
    invalid_cursor_name: 'Invalid cursor name!',
    invalid_schema_name: 'Invalid schema name!',
    invalid_sql_statement_name: 'Invalid SQL statement name!',
    invalid_authorization_specification: 'Invalid authorization specification!',
    dependent_privilege_descriptors_still_exist:
      'Dependent privilege descriptors still exist!',
    dependent_objects_still_exist: 'Dependent objects still exist!',
    invalid_transaction_termination: 'Invalid transaction termination!',
    sql_routine_exception: 'SQL routine exception!',
    invalid_catalog_name: 'Invalid catalog name!',
    invalid_schema_definition: 'Invalid schema definition!',
    invalid_table_definition: 'Invalid table definition!',
    invalid_column_definition: 'Invalid column definition!',
    invalid_cursor_declaration: 'Invalid cursor declaration!',
    invalid_transaction_initiation: 'Invalid transaction initiation!',
    invalid_sql_condition_name: 'Invalid SQL condition name!',
    invalid_sql_descriptor_name: 'Invalid SQL descriptor name!',
    invalid_cursor_reference: 'Invalid cursor reference!',
    invalid_character_value_for_cast: 'Invalid character value for cast!',
    most_specific_type_mismatch: 'Most specific type mismatch!',
    null_value_no_indicator_parameter:
      'Null value with no indicator parameter!',
    trigger_protocol_violated: 'Trigger protocol violated!',
    featured_not_supported: 'Feature not supported!',
    connection_exception: 'Connection exception!',
    connection_does_not_exist: 'Connection does not exist!',
    connection_failure: 'Connection failure!',
    sqlclient_unable_to_establish_sqlconnection:
      'SQL client unable to establish SQL connection!',
    sqlserver_rejected_establishment_of_sqlconnection:
      'SQL server rejected establishment of SQL connection!',
    transaction_resolution_unknown: 'Transaction resolution unknown!',
    protocol_violation: 'Protocol violation!',
    data_corrupted: 'Data corrupted!',
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error'; // Default message

    console.log(exception);

    // Type assertion for PostgreSQL error object
    if (
      exception &&
      typeof exception === 'object' &&
      exception !== null &&
      'routine' in exception
    ) {
      const pgException = exception as { routine: string };
      const routine = pgException.routine;
      if (this.pgErrorMessages[routine]) {
        message = this.pgErrorMessages[routine];
      }
    }

    // Check for HttpException
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as any).message;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
