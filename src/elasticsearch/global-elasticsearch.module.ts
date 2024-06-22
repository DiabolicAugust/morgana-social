import { Module, Global } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200', // Local Elasticsearch URL
    }),
  ],
  exports: [ElasticsearchModule],
})
export class GlobalElasticsearchModule {}
