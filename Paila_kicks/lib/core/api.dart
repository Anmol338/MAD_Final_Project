import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

// const String URL = "http://10.172.20.9:5000/api/v1";
const String URL = "https://long-jade-barracuda-tie.cyclic.app/api/v1";
const Map<String, dynamic> DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

class Api {
  final Dio _dio = Dio();

  Api(){
    _dio.options.baseUrl = URL;
    // interceptors
    _dio.options.headers = DEFAULT_HEADERS;
    _dio.interceptors.add( PrettyDioLogger(
      requestBody: true,
      requestHeader: true,
      responseBody: true,
      responseHeader: true
    ) );
  }

  Dio get sendRequest => _dio;
}

class ApiResponse {
  bool success;
  dynamic data;
  String? message;

  ApiResponse({
    required this.success,
    this.data,
    this.message,
  });

  factory ApiResponse.fromResponse(Response response){
    final data = response.data as Map<String, dynamic>;
    return ApiResponse(
        success: data["success"],
      data: data["data"],
      message: data["message"] ?? "Unexpected error"
    );
  }
}
