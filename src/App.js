import React, { useState } from 'react';
import { Button, Card, Col, Row, Typography } from 'antd';
import SchemaField from './SchemaField'; 

const { Title } = Typography;

const buildJsonSchema = (fieldsArray) => {
  const schema = {};
  fieldsArray.forEach(field => {
    if (!field.name) return; 

    if (field.type === 'String') {
      schema[field.name] = { type: 'string', default: 'DefaultString' };
    } else if (field.type === 'Number') {
      schema[field.name] = { type: 'number', default: 0 };
    } else if (field.type === 'Nested' && field.children) {
      schema[field.name] = {
        type: 'object',
        properties: buildJsonSchema(field.children) 
      };
    }
  });
  return schema;
};

function App() {

  const [fields, setFields] = useState([]);

 
  const addField = () => {
    
    setFields([...fields, { id: Date.now(), name: '', type: 'String', children: [] }]);
  };

 
  const removeFieldRecursive = (fieldIdToRemove, currentFields) => {
    return currentFields
      .filter(field => field.id !== fieldIdToRemove) 
      .map(field => {
      
        if (field.type === 'Nested' && field.children && field.children.length > 0) {
          return {
            ...field,
            children: removeFieldRecursive(fieldIdToRemove, field.children) 
          };
        }
        return field; 
      });
  };

 
  const updateFieldRecursive = (fieldIdToUpdate, newProps, currentFields) => {
    return currentFields.map(field => {
      if (field.id === fieldIdToUpdate) {
        return { ...field, ...newProps }; 
      }
     
      if (field.type === 'Nested' && field.children) {
        return {
          ...field,
          children: updateFieldRecursive(fieldIdToUpdate, newProps, field.children)
        };
      }
      return field;
    });
  };


  const handleUpdate = (fieldIdToUpdate, newProps) => {
    setFields(prevFields => updateFieldRecursive(fieldIdToUpdate, newProps, prevFields));
  };

  
  const handleRemove = (fieldIdToRemove) => {
    setFields(prevFields => removeFieldRecursive(fieldIdToRemove, prevFields));
  };

  const jsonSchemaOutput = buildJsonSchema(fields);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>JSON Schema Builder (Ant Design - Manual State)</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Schema Editor" style={{ minHeight: '400px' }}>
            {fields.map((field) => (
              <SchemaField
                key={field.id}
                field={field}
                onUpdate={handleUpdate}   
                onRemove={handleRemove}   
              />
            ))}

            <Button
              type="dashed"
              onClick={addField}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Add Field
            </Button>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="JSON Preview" style={{ minHeight: '400px' }}>
            <pre style={{
              backgroundColor: '#f0f2f5',
              padding: '15px',
              borderRadius: '8px',
              overflowX: 'auto',
              minHeight: '320px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {JSON.stringify(jsonSchemaOutput, null, 2)}
            </pre>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;